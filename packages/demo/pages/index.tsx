import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<{ ip: string }> = ({ ip }) => {
  return <>It works! Your IP is {ip}</>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const requestIp = require('request-ip');
  const ip = requestIp.getClientIp(context.req);

  return { props: { ip } };
};

export default Index;
