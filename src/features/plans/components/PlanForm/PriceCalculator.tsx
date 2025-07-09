import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, InputNumber, Typography, Alert } from 'antd';
import { FormInstance } from 'antd/es/form';

const { Text } = Typography;

interface PriceCalculatorProps {
  form: FormInstance;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ form }) => {
  const [autoCalculatedYearly, setAutoCalculatedYearly] = useState<number>(0);
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Calculer le prix annuel automatiquement
  useEffect(() => {
    const monthlyPrice = form.getFieldValue('monthly_price') || 0;
    const discountPercent = form.getFieldValue('yearly_discount_percent') || 0;
    
    const calculated = monthlyPrice * 12 * (1 - discountPercent / 100);
    setAutoCalculatedYearly(calculated);

    // Vérifier si l'utilisateur a modifié manuellement le prix annuel
    const currentYearlyPrice = form.getFieldValue('yearly_price') || 0;
    const isOverride = Math.abs(currentYearlyPrice - calculated) > 0.01;
    setIsManualOverride(isOverride);
  }, [form]);

  const handleMonthlyPriceChange = (value: number | null) => {
    if (value !== null && !isManualOverride) {
      const discountPercent = form.getFieldValue('yearly_discount_percent') || 0;
      const calculated = value * 12 * (1 - discountPercent / 100);
      form.setFieldsValue({ yearly_price: Number(calculated.toFixed(2)) });
      setAutoCalculatedYearly(calculated);
    }
  };

  const handleDiscountChange = (value: number | null) => {
    if (value !== null && !isManualOverride) {
      const monthlyPrice = form.getFieldValue('monthly_price') || 0;
      const calculated = monthlyPrice * 12 * (1 - value / 100);
      form.setFieldsValue({ yearly_price: Number(calculated.toFixed(2)) });
      setAutoCalculatedYearly(calculated);
    }
  };

  const handleYearlyPriceChange = (value: number | null) => {
    if (value !== null) {
      const monthlyPrice = form.getFieldValue('monthly_price') || 0;
      const discountPercent = form.getFieldValue('yearly_discount_percent') || 0;
      const expected = monthlyPrice * 12 * (1 - discountPercent / 100);
      
      setIsManualOverride(Math.abs(value - expected) > 0.01);
    }
  };

  const resetToAutoCalculated = () => {
    form.setFieldsValue({ yearly_price: autoCalculatedYearly });
    setIsManualOverride(false);
  };

  const monthlyPrice = form.getFieldValue('monthly_price') || 0;
  const yearlyPrice = form.getFieldValue('yearly_price') || 0;
  const discountPercent = form.getFieldValue('yearly_discount_percent') || 0;
  
  const yearlyTotal = monthlyPrice * 12;
  const yearlySavings = yearlyTotal - yearlyPrice;
  const actualDiscountPercent = yearlyTotal > 0 ? (yearlySavings / yearlyTotal) * 100 : 0;

  return (
    <Card title="Tarification" style={{ marginBottom: '24px' }}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Prix mensuel (€)"
            name="monthly_price"
            rules={[
              { required: true, message: 'Prix mensuel requis' },
              { type: 'number', min: 0, message: 'Le prix doit être positif' }
            ]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              onChange={handleMonthlyPriceChange}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="Remise annuelle (%)"
            name="yearly_discount_percent"
            rules={[
              { type: 'number', min: 0, max: 100, message: 'La remise doit être entre 0 et 100%' }
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              precision={1}
              style={{ width: '100%' }}
              onChange={handleDiscountChange}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="Prix annuel (€)"
            name="yearly_price"
            rules={[
              { required: true, message: 'Prix annuel requis' },
              { type: 'number', min: 0, message: 'Le prix doit être positif' }
            ]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              onChange={handleYearlyPriceChange}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Informations de calcul */}
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Text strong>Prix mensuel × 12 :</Text>
            <br />
            <Text>{yearlyTotal.toFixed(2)} €</Text>
          </Col>
          <Col xs={24} md={8}>
            <Text strong>Économies annuelles :</Text>
            <br />
            <Text style={{ color: yearlySavings > 0 ? '#52c41a' : '#ff4d4f' }}>
              {yearlySavings.toFixed(2)} €
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Text strong>Remise effective :</Text>
            <br />
            <Text>{actualDiscountPercent.toFixed(1)} %</Text>
          </Col>
        </Row>
      </div>

      {/* Alertes */}
      {isManualOverride && (
        <Alert
          message="Prix annuel modifié manuellement"
          description={
            <div>
              Le prix annuel ne correspond pas au calcul automatique ({autoCalculatedYearly.toFixed(2)} €).
              <br />
              <a onClick={resetToAutoCalculated} style={{ cursor: 'pointer' }}>
                Rétablir le calcul automatique
              </a>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}

      {yearlyPrice > yearlyTotal && (
        <Alert
          message="Prix annuel supérieur au prix mensuel"
          description="Le prix annuel ne devrait pas être supérieur au prix mensuel × 12"
          type="error"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}
    </Card>
  );
}; 