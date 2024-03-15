import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const RefreshTokenHandler = (props: any) => {
  const { data: session } = useSession<any>();

  useEffect(() => {
    if (!!session) {
      console.log('checkkkkk>>', session.accessTokenExpiry);
      console.log('checkkkkk>> date', Date.now());
      const timeRemaining = Math.round((session.accessTokenExpiry - 30 * 60 * 1000 - Date.now()) / 1000);
      props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
