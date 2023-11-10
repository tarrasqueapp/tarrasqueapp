import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Paper, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import { Center } from '../../components/common/Center';
import { Logo } from '../../components/common/Logo';
import { NextLink } from '../../components/common/NextLink';
import { ControlledPasswordField } from '../../components/form/ControlledPasswordField';
import { getSetup } from '../../hooks/data/setup/useGetSetup';
import { checkPasswordResetToken, useResetPassword } from '../../hooks/data/users/useResetPassword';
import { AppNavigation } from '../../lib/navigation';
import { SSRUtils } from '../../utils/SSRUtils';
import { ValidateUtils } from '../../utils/ValidateUtils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the setup data from the database
  const setup = await getSetup();

  // Render normally if the server can't be reached
  if (!setup) return { props: {} };

  // Redirect to the setup page if the setup is not completed
  if (!setup.completed) return { props: {}, redirect: { destination: AppNavigation.Setup } };

  const ssr = new SSRUtils(context);

  // Get the user
  const user = await ssr.getUser();

  // Redirect to the dashboard page if the user is signed in
  if (user) {
    return { props: {}, redirect: { destination: AppNavigation.Dashboard } };
  }

  // Get the token from the query string
  const token = (context.query.token as string) || '';

  // Check the reset password token
  let valid = false;
  try {
    await checkPasswordResetToken(context.query.token as string);
    valid = true;
  } catch (err) {}

  return { props: { token, valid, dehydratedState: ssr.dehydrate() } };
};

const ResetPasswordPage: NextPage<{ token: string; valid: boolean }> = ({ token, valid }) => {
  const resetPassword = useResetPassword();

  const router = useRouter();

  // Setup form validation schema
  const schema = yup
    .object()
    .shape(
      {
        password: ValidateUtils.Password,
        confirmPassword: ValidateUtils.Password.oneOf([yup.ref('password')], 'Passwords must match'),
      },
      [['password', 'password']],
    )
    .required();
  type Schema = yup.InferType<typeof schema>;

  // Setup form
  const methods = useForm<Schema>({ mode: 'onChange', resolver: yupResolver(schema) });
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
      await resetPassword.mutateAsync({ token, ...values });
      router.push(AppNavigation.Dashboard);
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
            Reset password
          </Typography>

          <Paper sx={{ p: 2, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}>
            {!token && <Typography align="center">No token was provided</Typography>}
            {token && !valid && <Typography align="center">Invalid token</Typography>}
            {token && valid && (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, gap: 2 }}>
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
            )}
          </Paper>

          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            Already have an account? <NextLink href={AppNavigation.SignIn}>Sign in</NextLink>
          </Typography>
        </Box>
      </Container>
    </Center>
  );
};

export default ResetPasswordPage;
