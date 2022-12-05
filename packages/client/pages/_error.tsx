import { captureException, flush } from '@sentry/nextjs';
import type { NextPage } from 'next';
import NextErrorComponent from 'next/error';
import type { ErrorProps } from 'next/error';

interface AppErrorProps extends ErrorProps {
  err?: Error;
  hasGetInitialPropsRun?: boolean;
}

const AppError: NextPage<AppErrorProps> = ({ hasGetInitialPropsRun, err, statusCode }) => {
  if (!hasGetInitialPropsRun && err) {
    captureException(err);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

AppError.getInitialProps = async (ctx) => {
  const errorInitialProps: AppErrorProps = await NextErrorComponent.getInitialProps(ctx);
  errorInitialProps.hasGetInitialPropsRun = true;
  if (ctx.err) {
    captureException(ctx.err);
    await flush(2000);
    return errorInitialProps;
  }
  captureException(new Error(`_error.tsx getInitialProps missing data at path: ${ctx.asPath}`));
  await flush(2000);

  return errorInitialProps;
};

export default AppError;
