import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextLink } from '../../components/common/NextLink';
import { ControlledTextField } from '../../components/form/ControlledTextField';
import { useForgotPassword } from '../../hooks/data/auth/useForgotPassword';
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

  return { props: { dehydratedState: ssr.dehydrate() } };
};

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup.object({ email: ValidateUtils.Email }).required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { email: (router.query.email as string) || '' },
  });
  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = methods;

  /**
   * Handle the form submission
   * @param values - The user values
   */
  async function handleSubmitForm(values: Schema) {
    try {
      await forgotPassword.mutateAsync(values.email);
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
            Forgot password
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleSubmitForm)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
                  {isSubmitted && (
                    <Alert severity="info" variant="outlined" sx={{ mb: 1 }}>
                      If an account with that email exists, we&apos;ve sent you an email with a link to reset your
                      password.
                    </Alert>
                  )}

                  <ControlledTextField name="email" label="Email" autoFocus />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <LoadingButton loading={isSubmitting} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
                    Submit
                  </LoadingButton>
                </Box>
              </form>
            </FormProvider>
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Back to <NextLink href={AppNavigation.SignIn}>sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
}
