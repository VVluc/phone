import { Button, Card, Input, Row, Spacer, Text } from '@nextui-org/react';
import { getSession, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Login() {
  const [error, setError] = useState<string | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res?.error);
    } else {
      const session = await getSession();
      if (session && session.roles.some((e: string) => e === 'admin' || e === 'manager' || e === 'employee')) {
        const name = '/admin/dashboard';
        router.replace(name);
      } else if (session && session.roles.includes('user')) {
        const name = (router.query.name as string) || '/';
        router.replace(name);
      }
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [session]);

  return (
    <>
      <section className="container">
        <div className="bg-preview">
          {!loaded && <Image src="/login.jpg" layout="fill" priority alt="video preview image" objectFit="cover" />}
        </div>
        <form autoComplete="off" autoSave="off" onSubmit={handleSubmit(onSubmit)}>
          <Card css={{ width: '300px' }}>
            {error && (
              <Card.Header>
                <Text color="error">Lỗi xác thực</Text>
              </Card.Header>
            )}
            <Card.Header css={{ justifyContent: 'center' }}>
              <Text color="secondary">Đăng nhập</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ py: '$10' }}>
              <Spacer y={1} />
              <Input
                labelPlaceholder="Username"
                {...register('username', { required: true })}
                required
                autoComplete="off"
                autoSave="off"
              />
              <Spacer y={2} />
              <Input
                type="password"
                labelPlaceholder="Password"
                {...register('password', { required: true })}
                required
                autoComplete="off"
                autoSave="off"
              />
            </Card.Body>
            <Card.Footer css={{ flexDirection: 'column' }}>
              <Row justify="center">
                <Button type="submit" size="sm" color="secondary">
                  Đăng nhập
                </Button>
              </Row>
              <Row css={{ mt: 10 }}>
                <Text>
                  Chưa có tài khoản?
                  <Link href="/auth/register">
                    <a
                      style={{
                        textDecoration: 'underline',
                        color: '#bd1c0e',
                      }}
                    >
                      {' '}
                      Đăng ký
                    </a>
                  </Link>
                </Text>
              </Row>
            </Card.Footer>
            <Card.Divider />
            {/* <Card.Footer css={{ flexDirection: 'column', gap: 5 }}>
            
            </Card.Footer> */}
          </Card>
        </form>
      </section>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
