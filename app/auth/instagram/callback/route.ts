import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('Instagram OAuth error:', error, errorDescription);
    return NextResponse.redirect(new URL('/instagram?error=access_denied', request.url));
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/instagram?error=no_code', request.url));
  }

  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/instagram/callback`;

    if (!clientId || !clientSecret) {
      throw new Error('Instagram credentials not configured');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    // Get user profile information
    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${access_token}`);
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const profileData = await profileResponse.json();

    // Store user data in Supabase
    const supabase = createClient();
    
    const { data: userData, error: userError } = await supabase
      .from('instagram_users')
      .upsert({
        instagram_id: profileData.id,
        username: profileData.username,
        account_type: profileData.account_type,
        media_count: profileData.media_count,
        access_token: access_token,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError) {
      console.error('Failed to store user data:', userError);
      throw new Error('Failed to save user information');
    }

    // Set user session
    const response = NextResponse.redirect(new URL('/instagram/dashboard', request.url));
    response.cookies.set('instagram_user_id', profileData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    return NextResponse.redirect(new URL('/instagram?error=auth_failed', request.url));
  }
}