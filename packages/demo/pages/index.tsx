import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<{ ip1: string; ip2: string; ip3: string }> = ({ ip1, ip2, ip3 }) => {
  return (
    <>
      It works! Your IP is {JSON.stringify(ip1)} {JSON.stringify(ip2)} {JSON.stringify(ip3)}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ip1 = context.req.headers['x-forwarded-for'];
  const ip2 = context.req.headers['x-real-ip'];
  const ip3 = context.req.connection.remoteAddress;

  return { props: { ip1, ip2, ip3 } };
};

export default Index;
