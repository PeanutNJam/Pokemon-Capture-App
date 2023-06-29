import { Button, Checkbox, ConfigProvider, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from "../Store/auth-context";
import "./LoginForm.css";


const LoginForm = () => {

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const response = await fetch('http://localhost:5000/api/users/login',
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
      authCtx.login(responseData.token);
      localStorage.setItem("UserId", responseData.userId)
      navigate("/home");
    } catch (err) {
      alert(err);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input placeholder="Input Username" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password placeholder="Input Password"/>
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Checkbox: {
                colorPrimary: '#ffcc00',
              },
            },
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </ConfigProvider>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <ConfigProvider 
          theme={{
            token: {
              colorPrimary: '#ffcc00',
            },
          }}
        >
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </ConfigProvider>
      </Form.Item>
      <div class="register-div">
        <a href="http://localhost:3000/signup">Click here to register now!</a>
      </div>
    </Form>
  );
};

export default LoginForm;