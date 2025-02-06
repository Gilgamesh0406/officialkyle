'use client';

import { useEffect, useState } from 'react';

const useMutedUsers = () => {
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMutedUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/muted-users');
        if (!response.ok) {
          throw new Error(`Failed to fetch muted users: ${response.statusText}`);
        }

        const data = await response.json();
        setMutedUsers(data);
      } catch (err: any) {
        console.error('Error fetching muted users:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMutedUsers();
  }, []);

  console.log(mutedUsers)

  return { mutedUsers, isLoading, error };
};

export default useMutedUsers;
