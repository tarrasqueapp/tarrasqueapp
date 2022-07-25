import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<{ ip: string }> = ({ ip }) => {
  return <>It works! Your IP is {JSON.stringify(ip)}</>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let ip;
  if (context.req.headers['x-forwarded-for']) {
    ip = context.req.headers['x-forwarded-for'];
  } else if (context.req.headers['x-real-ip']) {
    ip = context.req.headers['x-real-ip'];
  } else {
    ip = context.req.connection.remoteAddress;
  }

  return {
    props: {
      ip,
    },
  };
};

export default Index;
