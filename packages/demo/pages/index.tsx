import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

const Index: NextPage<any> = ({ ips }) => {
  return <>It works! Your IPs are {JSON.stringify(ips)}</>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const requestIp = require('request-ip');
  const ip = requestIp.getClientIp(context.req);

  const ips = [
    context.req.headers['X-Client-IP'],
    context.req.headers['X-Forwarded-For'],
    context.req.headers['CF-Connecting-IP'],
    context.req.headers['True-Client-Ip'],
    context.req.headers['X-Real-IP'],
    context.req.headers['X-Forwarded'],
    context.req.headers['Forwarded-For'],
    context.req.connection.remoteAddress,
    context.req.socket.remoteAddress,
    context.req.headers['Cf-Pseudo-IPv4'],
    ip,
  ];

  return { props: { ips } };
};

export default Index;
