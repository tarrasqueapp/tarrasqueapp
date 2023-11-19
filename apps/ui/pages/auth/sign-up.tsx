import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { ActionTokenEntity, ActionTokenType } from '@tarrasque/sdk';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextLink } from '../../components/common/NextLink';
import { ControlledPasswordField } from '../../components/form/ControlledPasswordField';
import { ControlledTextField } from '../../components/form/ControlledTextField';
import { useSignUp } from '../../hooks/data/auth/useSignUp';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';
import { ValidateUtils } from '../../utils/ValidateUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssr = new SSRUtils(context);

  const setup = await ssr.getSetup();

  // Redirect to the setup page if the setup is not completed
  if (!setup?.completed) {
    return { props: {}, redirect: { destination: AppNavigation.Setup } };
  }

  // Get the user
  const user = await ssr.getUser();

  // Redirect to the dashboard page if the user is signed in
  if (user) {
    return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  }

  const token = (context.query.token as string) || '';
  const actionToken = await ssr.getActionToken(token, ActionTokenType.INVITE);

  return { props: { actionToken, dehydratedState: ssr.dehydrate() } };
};

interface Props {
  actionToken?: ActionTokenEntity;
}

export default function SignUpPage({ actionToken }: Props) {
  const signUp = useSignUp();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        name: ValidateUtils.Name,
        email: ValidateUtils.Email,
        password: ValidateUtils.Password,
        confirmPassword: ValidateUtils.Password.oneOf([yup.ref('password')], 'Passwords must match'),
      },
      [['password', 'password']],
    )
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { email: (router.query.email as string) || actionToken?.email || '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await signUp.mutateAsync({ ...values, token: actionToken?.id });
      router.push(AppNavigation.VerifyEmail);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Center>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Logo size={150} />
          </Box>

          <Typography variant="h3" align="center" sx={{ mt: 1, mb: 3 }}>
            Sign up
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            {actionToken ? (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
                    <ControlledTextField name="name" label="Name" autoFocus />

                    <ControlledTextField name="email" label="Email" disabled />

                    <ControlledPasswordField name="password" label="Password" />

                    <ControlledPasswordField name="confirmPassword" label="Confirm Password" />
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
                      Submit
                    </LoadingButton>
                  </Box>
                </form>
              </FormProvider>
            ) : (
              <>
                <Typography align="center">
                  It appears the invitation link you&apos;ve tried to use is either <strong>expired or invalid</strong>.
                  If the link has expired, you may need to request a new one from the sender.
                </Typography>
              </>
            )}
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Already have an account? <NextLink href={AppNavigation.SignIn}>Sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
