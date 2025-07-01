import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MatchRequest {
  service_type: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  budget_range?: {
    min: number;
    max: number;
  };
  description?: string;
  customer_phone?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const matchRequest: MatchRequest = await req.json()
    
    // Find matching fundis based on criteria
    const matches = await findMatchingFundis(matchRequest, supabase)
    
    // Rank matches using AI scoring
    const rankedMatches = await rankMatches(matches, matchRequest)
    
    return new Response(
      JSON.stringify({
        success: true,
        matches: rankedMatches,
        total_found: rankedMatches.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in AI matcher:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function findMatchingFundis(request: MatchRequest, supabase: any) {
  let query = supabase
    .from('fundis')
    .select(`
      *,
      profiles!inner(full_name, phone, location, avatar_url)
    `)
    .eq('verification_status', true)

  // Filter by service type
  if (request.service_type) {
    // This would need to be more sophisticated in production
    query = query.contains('specialties', [request.service_type])
  }

  // Filter by availability based on urgency
  if (request.urgency === 'high') {
    query = query.eq('availability', 'available')
  } else {
    query = query.in('availability', ['available', 'busy'])
  }

  // Filter by budget if provided
  if (request.budget_range) {
    query = query
      .gte('hourly_rate', request.budget_range.min)
      .lte('hourly_rate', request.budget_range.max)
  }

  // Filter by location (simplified - in production would use geographical distance)
  if (request.location) {
    query = query.ilike('location', `%${request.location}%`)
  }

  const { data: fundis, error } = await query
    .order('rating', { ascending: false })
    .order('completed_jobs', { ascending: false })
    .limit(10)

  if (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }

  return fundis || []
}

async function rankMatches(fundis: any[], request: MatchRequest) {
  return fundis.map(fundi => {
    let score = 0
    let reasons = []

    // Rating score (0-30 points)
    score += (fundi.rating / 5) * 30
    if (fundi.rating >= 4.5) {
      reasons.push('Excellent ratings')
    }

    // Experience score (0-20 points)
    score += Math.min(fundi.completed_jobs / 50, 1) * 20
    if (fundi.completed_jobs > 100) {
      reasons.push('Highly experienced')
    }

    // Availability score (0-25 points)
    if (fundi.availability === 'available') {
      score += 25
      reasons.push('Available now')
    } else if (fundi.availability === 'busy' && request.urgency === 'low') {
      score += 15
      reasons.push('Available soon')
    }

    // Location proximity (0-15 points) - simplified
    if (request.location && fundi.location?.toLowerCase().includes(request.location.toLowerCase())) {
      score += 15
      reasons.push('Near your location')
    }

    // Budget compatibility (0-10 points)
    if (request.budget_range) {
      const rate = fundi.hourly_rate
      if (rate >= request.budget_range.min && rate <= request.budget_range.max) {
        score += 10
        reasons.push('Within budget')
      }
    }

    return {
      ...fundi,
      match_score: Math.round(score),
      match_reasons: reasons,
      estimated_response_time: fundi.availability === 'available' ? '15-30 mins' : '1-2 hours'
    }
  }).sort((a, b) => b.match_score - a.match_score)
}