import React, { useState } from 'react';
import { Steps, Button, Form, Input, Radio, Card, Divider, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCart } from '../cart/CartManager';
import { CheckoutForm } from '../../types/cart';

const { Step } = Steps;

const CheckoutFlow: React.FC = () => {
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm<CheckoutForm>();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const steps = [
    {
      title: t('checkout.steps.cart'),
      content: 'Cart Summary',
    },
    {
      title: t('checkout.steps.billing'),
      content: 'Billing Information',
    },
    {
      title: t('checkout.steps.payment'),
      content: 'Payment Method',
    },
    {
      title: t('checkout.steps.confirmation'),
      content: 'Order Confirmation',
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      console.log('Checkout form submitted:', values);
      console.log('Cart contents:', cart);
      
      const mockOrderId = `ORD-${Date.now()}`;
      setOrderId(mockOrderId);
      
      setCurrent(steps.length - 1);
      setCheckoutComplete(true);
      
      clearCart();
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const renderCartSummary = () => (
    <Card title={t('checkout.cartSummary')} bordered={false}>
      {cart.items.map((item) => (
        <div key={item.courseId} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {t('checkout.instructor')}: {item.instructor}
          </div>
        </div>
      ))}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{t('checkout.subtotal')}:</span>
        <span>${cart.subtotal.toFixed(2)}</span>
      </div>
      {cart.discount && (
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52c41a' }}>
          <span>{t('checkout.discount')} ({cart.discount.code}):</span>
          <span>-${cart.discount.amount.toFixed(2)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '10px' }}>
        <span>{t('checkout.total')}:</span>
        <span>${cart.total.toFixed(2)}</span>
      </div>
    </Card>
  );

  const renderBillingForm = () => (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ paymentMethod: 'STRIPE' }}
    >
      <Form.Item
        name={['billingInfo', 'name']}
        label={t('checkout.billing.name')}
        rules={[{ required: true, message: t('checkout.billing.nameRequired') }]}
      >
        <Input placeholder={t('checkout.billing.namePlaceholder')} />
      </Form.Item>
      
      <Form.Item
        name={['billingInfo', 'email']}
        label={t('checkout.billing.email')}
        rules={[
          { required: true, message: t('checkout.billing.emailRequired') },
          { type: 'email', message: t('checkout.billing.emailInvalid') }
        ]}
      >
        <Input placeholder={t('checkout.billing.emailPlaceholder')} />
      </Form.Item>
      
      <Form.Item
        name={['billingInfo', 'address']}
        label={t('checkout.billing.address')}
        rules={[{ required: true, message: t('checkout.billing.addressRequired') }]}
      >
        <Input.TextArea 
          placeholder={t('checkout.billing.addressPlaceholder')} 
          rows={3} 
        />
      </Form.Item>
    </Form>
  );

  const renderPaymentMethodForm = () => (
    <Form.Item
      name="paymentMethod"
      label={t('checkout.payment.method')}
      rules={[{ required: true, message: t('checkout.payment.methodRequired') }]}
    >
      <Radio.Group>
        <Radio value="STRIPE">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
              alt="Stripe" 
              style={{ height: '24px', marginRight: '10px' }} 
            />
            {t('checkout.payment.stripe')}
          </div>
        </Radio>
        <div style={{ height: '10px' }} />
        <Radio value="VNPAY">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png" 
              alt="VNPAY" 
              style={{ height: '24px', marginRight: '10px' }} 
            />
            {t('checkout.payment.vnpay')}
          </div>
        </Radio>
      </Radio.Group>
    </Form.Item>
  );

  const renderConfirmation = () => (
    <Result
      status="success"
      title={t('checkout.confirmation.title')}
      subTitle={t('checkout.confirmation.orderNumber', { orderId })}
      extra={[
        <Button type="primary" key="console" href="/order-history">
          {t('checkout.confirmation.viewOrders')}
        </Button>,
        <Button key="buy" href="/courses">
          {t('checkout.confirmation.continueShopping')}
        </Button>,
      ]}
    />
  );

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 2 }}>
              <h2>{t('checkout.yourCart')}</h2>
              {cart.items.length === 0 ? (
                <div>{t('checkout.emptyCart')}</div>
              ) : (
                cart.items.map((item) => (
                  <Card key={item.courseId} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{t('checkout.instructor')}: {item.instructor}</p>
                      </div>
                      <div>
                        <h3>${item.price.toFixed(2)}</h3>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
            <div style={{ flex: 1 }}>
              {renderCartSummary()}
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 2 }}>
              <h2>{t('checkout.billingInformation')}</h2>
              {renderBillingForm()}
            </div>
            <div style={{ flex: 1 }}>
              {renderCartSummary()}
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 2 }}>
              <h2>{t('checkout.paymentMethod')}</h2>
              {renderPaymentMethodForm()}
              {form.getFieldValue('paymentMethod') === 'STRIPE' && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                  <h3>{t('checkout.payment.cardDetails')}</h3>
                  <p>{t('checkout.payment.stripeIntegration')}</p>
                  {/* In a real implementation, this would be the Stripe Elements component */}
                  <div style={{ height: '40px', backgroundColor: '#f9f9f9', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center' }}>
                    {t('checkout.payment.cardElementPlaceholder')}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              {renderCartSummary()}
            </div>
          </div>
        );
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  return (
    <div>
      <Steps current={current} style={{ marginBottom: '30px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <div className="steps-content" style={{ marginBottom: '30px' }}>
        {renderStepContent()}
      </div>
      
      <div className="steps-action" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {current > 0 && current < steps.length - 1 && (
          <Button onClick={prev}>
            {t('checkout.previous')}
          </Button>
        )}
        
        {current === 0 && cart.items.length === 0 && (
          <Button type="primary" href="/courses">
            {t('checkout.browseCoursesButton')}
          </Button>
        )}
        
        {current === 0 && cart.items.length > 0 && (
          <Button type="primary" onClick={next}>
            {t('checkout.nextButton')}
          </Button>
        )}
        
        {current === 1 && (
          <Button type="primary" onClick={next}>
            {t('checkout.nextButton')}
          </Button>
        )}
        
        {current === 2 && (
          <Button type="primary" onClick={handleSubmit}>
            {t('checkout.placeOrderButton')}
          </Button>
        )}
        
        {current === 0 && <div />}
      </div>
    </div>
  );
};

export default CheckoutFlow;
