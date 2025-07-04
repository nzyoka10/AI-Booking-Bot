/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add policy to allow authenticated users to insert their own profile during signup
    - This enables the signup process to work properly by allowing new users to create their profile record

  The policy ensures users can only insert a profile with their own user_id (auth.uid()).
*/

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);