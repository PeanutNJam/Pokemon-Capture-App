import { Button, Form, Input, ConfigProvider } from 'antd';
import "./SignUpForm.css"
import { useNavigate } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const SignUpForm = () => {
  
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values)
    try {
      const response = await fetch('http://localhost:5000/api/users/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message)
      }

      console.log(responseData);
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };


  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            type: 'username',
            message: 'The username is not valid!',
          },
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="Please input your preferred username." />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Please input your preferred password."/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Please confirm your preferred password."/>
      </Form.Item>
      
      <Form.Item {...tailFormItemLayout}>
        <div class="button-div">
          <ConfigProvider 
            theme={{
              token: {
                colorPrimary: '#ffcc00',
              },
            }}
          >
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </ConfigProvider>
        </div>
      </Form.Item>
    </Form>
  );
};
export default SignUpForm;