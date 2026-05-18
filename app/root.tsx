import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {useEffect, useState} from "react";
import {
    getCurrentUser,
    signIn as puterSignIn,
    signOut as puterSignOut,
} from "../lib/puter.action";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const DEFAULT_AUTH_STATE: AuthState = {
    isSignedIn: false,
    userName: null,
    userId: null,
}

export default function App() {
    const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            const els = document.querySelectorAll<HTMLElement>('[data-animate]:not(.in-view)');
            if (!els.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
            );

            els.forEach((el) => observer.observe(el));
            return () => observer.disconnect();
        }, 60);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const refreshAuth = async () => {
        try {
            const user = await getCurrentUser();

            setAuthState({
                isSignedIn: !!user,
                userName: user?.username || null,
                userId: user?.uuid || null,
            });

            return !!user;
        } catch {
            setAuthState(DEFAULT_AUTH_STATE);
            return false;
        }
    }

    useEffect(() => {
        refreshAuth()
    }, []);

    const signIn = async () => {
        await puterSignIn();
        return await refreshAuth();
    }

    const signOut = async () => {
        puterSignOut();
        return await refreshAuth();
    }

  return (
      <main className="min-h-screen bg-background text-foreground relative z-10">
        <Outlet
            context={{ ...authState, refreshAuth, signIn, signOut }}
        />;
      </main>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
