import { Button, Card, Group, InputBase, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import Layout from '~/components/layout/layout';
import { z } from 'zod';

const schema = z.object({
  email: z.string().min(1, { message: 'Email should have at least 1 letters' }),
  password: z
    .string()
    .min(6, { message: 'Password name should have at least 6 letters' })
});

function LoginPage() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: ''
    }
  });
  return (
    <Layout>
      <Group position="center" h='80vh'>
        <Card w="500px" shadow="xl" p="40px 24px">
          <form action="">
            <InputBase
              label="Email address"
              placeholder="Enter your e-mail"
              mb="24px"
              {...form.getInputProps('email')}
            />

            <InputBase
              label="Password"
              placeholder="Enter your password"
              mb="24px"
              {...form.getInputProps('password')}
            />

            <Group position="center">
              <Button>Login</Button>
            </Group>
          </form>
        </Card>
      </Group>
    </Layout>
  );
}

export default LoginPage;
