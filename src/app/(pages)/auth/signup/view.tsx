'use client'
import { useViewportSize } from "@mantine/hooks";
import { Form, useForm, zodResolver } from "@mantine/form";
import { UserValidateSchema } from "@/shared/validators/schema/user";
import {
  Anchor,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Input,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text, ThemeIcon
} from "@mantine/core";
import classes from "@/app/(pages)/auth/signup/styles.module.scss";
import { IconAt, IconShieldLock, IconUser, IconUserPlus } from "@tabler/icons-react";
import useRequest from "@/app/hooks/useRequest";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { MainResponse } from "@/shared/types/response/dto";
import React, { useState } from "react";
import { UserFormType } from "@/app/(pages)/auth/signup/types";

export default function SignUpView() {
  const { create } = useRequest();
  const { height } = useViewportSize();
  const router = useRouter();
  const [ onSubmitLoading, setSubmitLoading ] = useState(false);
  const form = useForm<UserFormType>({
    initialValues: {
      firstName: String(),
      lastName: String(),
      email: String(),
      password: String(),
      confirmPassword: String()
    },
    validate: zodResolver(UserValidateSchema)
  });

  async function onSubmitSignUp() {
    form.validate();
    if (form.isValid()) {
      setSubmitLoading(true);
      try {
        const req = create('/auth/signup', form.values);
        await toast.promise(
          req,
          {
            loading: 'Cadastrando usuário...',
            success: () => {
              setSubmitLoading(false);
              router.push('/auth/signin');
              return <Text fw={500}>Usuário cadastrado com sucesso!</Text>
            },
            error: (error: AxiosError<MainResponse<[]>>) => {
              error.response?.data?.metadata.message.email?.forEach((emailError: string) => {
                if (emailError.includes('email')) {
                  // setValidationErrors({
                  //   ...validationErrors,
                  //   email: 'Email já cadastrado',
                  // });
                }
              });
              return <Text fw={500}>Erro ao cadastrar usuário!</Text>
            },
          },
        );
      } catch (e) {
        setSubmitLoading(false);
      }
    }
  }

  return (
    <Grid gutter={0}>
      <Grid.Col className={classes.aside} span='auto'>
        <Container size='lg' p='xl'>
          <Stack
            mih={height - 64}
            align='center'
            justify='center'
            gap="md">
            <ThemeIcon
              variant='light'
              radius={14}
              size={'15rem'}>
              <IconUserPlus className={classes.iconUserPlus} stroke={0.6}/>
            </ThemeIcon>
            <Text
              className={classes.illustrationText}
              mt='lg'
              size='1.5rem'>
              Faça parte da nossa comunidade
            </Text>
          </Stack>
        </Container>
      </Grid.Col>
      <Grid.Col className={classes.authForm} span='auto'>
        <Container size='sm' p='xl'>
          <Stack
            mih={height - 64}
            align='flex-start'
            justify='center'
            gap="md">
            <Card className={classes.signUpCard} withBorder shadow='xs' radius='md' w='100%'>
              <Card.Section withBorder inheritPadding py='sm'>
                <Group justify='center'>
                  <Text fw={500} size='lg'>Cadastro de usuário</Text>
                </Group>
              </Card.Section>
              <Center>
                <Text mt='md' c='dimmed'>
                  Preencha os campos abaixo para criar sua conta
                </Text>
              </Center>
              <Card.Section inheritPadding p='xl'>
                <SimpleGrid>
                  <Form form={form}>
                    <Stack gap="lg">
                      <Input
                        {...form.getInputProps('firstName')}
                        name='firstName'
                        type='text'
                        className={classes.input}
                        leftSection={<IconUser size='1.1rem'/>}
                        placeholder='Primeiro nome'
                        size="lg"
                      />
                      <Input
                        {...form.getInputProps('lastName')}
                        name='lastName'
                        type='text'
                        className={classes.input}
                        leftSection={<IconUser size='1.1rem'/>}
                        placeholder='Sobrenome'
                        size="lg"
                      />
                      <Input
                        {...form.getInputProps('email')}
                        name='email'
                        type='email'
                        className={classes.input}
                        leftSection={<IconAt size='1.1rem'/>}
                        placeholder="Email"
                        size="lg"
                      />
                      <PasswordInput
                        {...form.getInputProps('password')}
                        className={classes.input}
                        name='password'
                        type='password'
                        leftSection={<IconShieldLock size='1.1rem'/>}
                        size='lg'
                        placeholder='Senha'
                      />
                      <PasswordInput
                        {...form.getInputProps('confirmPassword')}
                        className={classes.input}
                        name='confirmPassword'
                        type='password'
                        leftSection={<IconShieldLock size='1.1rem'/>}
                        size='lg'
                        placeholder='Confirme a senha'
                      />
                      <Button
                        onClick={onSubmitSignUp}
                        className={classes.signinButton}
                        loading={onSubmitLoading}
                        disabled={onSubmitLoading}
                        variant='outline'
                        size='lg'
                        color='blue.4'
                        type='submit'>
                        Cadastrar
                      </Button>
                      <Center>
                        <Anchor
                          mt='md'
                          underline='always'
                          href={'/auth/signin'}>
                          Tem uma conta? Clique aqui
                        </Anchor>
                      </Center>
                    </Stack>
                  </Form>
                </SimpleGrid>
              </Card.Section>
            </Card>
          </Stack>
        </Container>
      </Grid.Col>
    </Grid>
  )
}