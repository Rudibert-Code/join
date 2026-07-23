import { Injectable, signal, inject } from '@angular/core';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Supabase } from './supabase'; // Import deines Haupt-Services

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabaseService = inject(Supabase);
  private supabase = this.supabaseService.supabase;

  /** Signal tracking the currently authenticated Supabase Auth user. */
  authUser = signal<SupabaseUser | null>(null);

  /** Signal denoting whether the session operates under guest access. */
  isGuest = signal(false);

  /** Signal indicating whether the initial authentication handshake complete. */
  authReady = signal(false);

  /** Internal promise preventing duplicated initialization calls during auth checks. */
  private authInitPromise: Promise<void> | null = null;

  /**
   * Evaluates if a valid user session or guest mode is currently active.
   *
   * @returns True if logged in as registered user or guest; false otherwise.
   */
  isLoggedIn(): boolean {
    return !!this.authUser() || this.isGuest();
  }

  /**
   * Ensures auth session initialization has finished before continuing route actions.
   */
  async ensureAuthLoaded(): Promise<void> {
    if (!this.authInitPromise) {
      this.authInitPromise = this.initAuth();
    }
    await this.authInitPromise;
  }

  /**
   * Initializes session auth state and attaches state change listener.
   */
  async initAuth(): Promise<void> {
    if (this.authReady()) return;

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    this.authUser.set(user);

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.authUser.set(session?.user ?? null);
      if (session?.user) {
        this.isGuest.set(false);
      }
    });

    this.authReady.set(true);
  }

  /**
   * Registers a new user via Supabase email authentication.
   */
  async signUpWithEmail(email: string, password: string, firstName: string, lastName: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
  }

  /**
   * Authenticates user with email and password credentials.
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      this.authUser.set(data.user);
      this.isGuest.set(false);
    }

    return { data, error };
  }

  /**
   * Activates guest session state, bypassing credential login.
   */
  signInAsGuest(): void {
    this.authUser.set(null);
    this.isGuest.set(true);
    this.authReady.set(true);
  }

  /**
   * Terminates active session and resets user auth signals.
   */
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.authUser.set(null);
    this.isGuest.set(false);
  }

  /**
   * Fetches the current authenticated user object from Supabase session.
   */
  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }
}
