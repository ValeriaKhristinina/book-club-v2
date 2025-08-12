import { Button, Card, Group, InputBase } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Layout from "~/components/layout/layout";
import { z } from "zod";
import { api } from "~/utils/api";
import { UserAuth } from "~/context/auth-context";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().min(1, { message: "Email should have at least 1 letters" }),
  password: z
    .string()
    .min(6, { message: "Password name should have at least 6 letters" })
});

function LoginPage() {
  const router = useRouter();
  const { setIsAuth } = UserAuth();
  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      console.log("Login successful");
      setIsAuth(true);
      router.push("/");
    },
    onError: (err) => {
      console.error(err.message);
    }
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
      password: ""
    }
  });

  const submitHandler = (values: typeof form.values) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password
    });
  };
  return (
    <Layout>
      <Group position="center" h="80vh">
        <Card w="500px" shadow="xl" p="40px 24px">
          <form action="submit" onSubmit={form.onSubmit(submitHandler)}>
            <InputBase
              label="Email address"
              placeholder="Enter your e-mail"
              mb="24px"
              {...form.getInputProps("email")}
            />

            <InputBase
              label="Password"
              placeholder="Enter your password"
              mb="24px"
              {...form.getInputProps("password")}
            />

            <Group position="center">
              <Button type="submit">Login</Button>
            </Group>
          </form>
        </Card>
      </Group>
    </Layout>
  );
}

export default LoginPage;
