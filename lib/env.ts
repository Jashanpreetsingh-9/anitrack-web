function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getServerEnv() {
  return {
    apiUrl: requireEnv("NEXT_PUBLIC_API_URL"),
    internalAuthSecret: requireEnv("INTERNAL_AUTH_SECRET"),
  };
}
