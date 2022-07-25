import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<any> = ({ ips }) => {
  return <>It works! Your IPs are {JSON.stringify(ips)}</>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ips = [
    context.req.headers['X-Forwarded-For'],
    context.req.headers['X-Real-Ip'],
    context.req.headers['CF-Connecting-IP'],
    context.req.connection.remoteAddress,
    context.req.socket.remoteAddress,
  ];

  return { props: { ips } };
};

export default Index;
