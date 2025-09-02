'use client'; // Mark this as a Client Component

import { useState, ReactNode, createContext, useContext, useEffect } from "react";
import { createBrowserSupabaseClient, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { RealtimeChannel } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';

// Types
interface PresenceState {
  user_id: string;
  username: string;
  avatar_url: string;
  reading_post?: string;
}

interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  new_record?: any;
}

interface SupabaseContextType {
  supabase: ReturnType<typeof createClientComponentClient>;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;
  updatePresence: (data: Partial<PresenceState>) => void;
  onlineUsers: PresenceState[];
  subscribe: (table: string, callback: (event: RealtimeEvent) => void) => RealtimeChannel;
  unsubscribe: (channel: RealtimeChannel) => void;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProviderClient({ children }: SupabaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);
  const [presenceChannel, setPresenceChannel] = useState<RealtimeChannel | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        setupPresence(session.user);
      } else if (event === 'SIGNED_OUT') {
        cleanupPresence();
      }
    });

    return () => {
      subscription.unsubscribe();
      cleanupPresence();
    };
  }, [supabase]);

  const setupPresence = (currentUser: User) => {
    if (presenceChannel) {
      presenceChannel.unsubscribe();
    }

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: PresenceState[] = [];
        Object.keys(state).forEach((key) => {
          const presences = state[key];
          if (presences && presences.length > 0) {
            presences.forEach((p) => {
              if (
                typeof (p as any).user_id === 'string' &&
                typeof (p as any).username === 'string' &&
                typeof (p as any).avatar_url === 'string'
              ) {
                users.push((p as unknown) as PresenceState);
              }
            });
          }
        });
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUser.id,
            username: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Anonymous',
            avatar_url:
              currentUser.user_metadata?.avatar_url ||
              (currentUser.user_metadata?.full_name
                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.user_metadata.full_name)}&background=0D8ABC&color=fff&size=40`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.email?.charAt(0) || 'A')}&background=0D8ABC&color=fff&size=40`),
          });
        }
      });

    setPresenceChannel(channel);
  };

  const cleanupPresence = () => {
    if (presenceChannel) {
      presenceChannel.unsubscribe();
      setPresenceChannel(null);
    }
    setOnlineUsers([]);
  };

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return result;
  };

  const signOut = async () => {
    cleanupPresence();
    await supabase.auth.signOut();
  };

  const updatePresence = (data: Partial<PresenceState>) => {
    if (presenceChannel && user) {
      presenceChannel.track({
        user_id: user.id,
        username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        avatar_url:
          user.user_metadata?.avatar_url ||
          (user.user_metadata?.full_name
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata.full_name)}&background=0D8ABC&color=fff&size=40`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email?.charAt(0) || 'A')}&background=0D8ABC&color=fff&size=40`),
        ...data,
      });
    }
  };

  const subscribe = (table: string, callback: (event: RealtimeEvent) => void) => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          callback({
            type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            table,
            new_record: payload.new,
          });
        }
      )
      .subscribe();

    return channel;
  };

  const unsubscribe = (channel: RealtimeChannel) => {
    channel.unsubscribe();
  };

  const value: SupabaseContextType = {
    supabase,
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updatePresence,
    onlineUsers,
    subscribe,
    unsubscribe,
  };

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
      <SupabaseContext.Provider value={value}>
        {children}
      </SupabaseContext.Provider>
    </SessionContextProvider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
