import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AuthPage } from '@refinedev/antd';
import { useLogin } from '@refinedev/core';

import { Title } from '@/components';

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  projectName: string;
  projectDescription: string;
};

type FieldConfig = {
  label: string;
  name: keyof FormValues;
  placeholder: string;
  rules: any[];
  type?: string;
  initialValue?: string;
};

// Configuration for the form fields
const formFields: FieldConfig[] = [
  {
    label: 'Full Name',
    name: 'fullName',
    placeholder: 'Enter your full name',
    rules: [{ required: true, message: 'Please enter your full name' }],
    initialValue: '',
  },
  {
    label: 'Email',
    name: 'email',
    placeholder: 'Enter your email',
    rules: [
      { required: true, type: 'email', message: 'Please enter a valid email' },
    ],
    initialValue: '',
  },
  {
    label: 'Phone Number',
    name: 'phoneNumber',
    placeholder: 'Enter your phone number',
    rules: [{ required: true, message: 'Please enter your phone number' }],
    initialValue: '',
  },
  {
    label: 'Company Name',
    name: 'companyName',
    placeholder: 'Enter your company name',
    rules: [{ required: true, message: 'Please enter your company name' }],
    initialValue: '',
  },
  {
    label: 'Project Name',
    name: 'projectName',
    placeholder: 'Enter your project name',
    rules: [{ required: true, message: 'Please enter your project name' }],
    initialValue: '',
  },
  {
    label: 'Project Description',
    name: 'projectDescription',
    placeholder: 'Describe your project',
    rules: [{ required: true, message: 'Please enter a project description' }],
    type: 'textarea',
    initialValue: '',
  },
];

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { mutate } = useLogin();

  const emailFromSearchParams = searchParams.get('email');
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  const initialValues = emailFromSearchParams
    ? { email: emailFromSearchParams }
    : {};

  useEffect(() => {
    if (accessToken && refreshToken) {
      mutate({
        accessToken,
        refreshToken,
      });
    }
  }, [accessToken, refreshToken]);

  return (
    <>
      <AuthPage
        type="login"
        formProps={{
          initialValues,
        }}
        contentProps={{
          styles: {
            actions: {
              '--ant-card-actions-li-margin': '0',
            } as any,
          },
        }}
        title={<Title collapsed={false} />}
      />
    </>
  );
};
