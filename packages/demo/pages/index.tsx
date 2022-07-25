import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<any> = ({ ip1, ip2, ip3, ip4 }) => {
  return (
    <>
      It works! Your IP is {JSON.stringify(ip1)} {JSON.stringify(ip2)} {JSON.stringify(ip3)} {JSON.stringify(ip4)}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ip1 = context.req.headers['X-Forwarded-For'];
  const ip2 = context.req.headers['X-Real-Ip'];
  const ip3 = context.req.headers['CF-Connecting-IP'];
  const ip4 = context.req.connection.remoteAddress;

  return { props: { ip1, ip2, ip3, ip4 } };
};

export default Index;
