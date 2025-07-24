import React, { useState, useEffect } from 'react';
import { Card, Typography, Badge, Divider, Space, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

const { Title, Text } = Typography;

interface PlanPreviewProps {
  form: FormInstance;
}

interface PlanFeature {
  key: string;
  text: {
    fr: string;
    en: string;
    he: string;
  };
  included: boolean;
  category: 'content' | 'distribution' | 'support';
}

export const PlanPreview: React.FC<PlanPreviewProps> = ({ form }) => {
  const [previewData, setPreviewData] = useState<any>({});
  const [previewLanguage, setPreviewLanguage] = useState('fr');

  // Mettre à jour la prévisualisation en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getFieldsValue();
      setPreviewData(values);
    }, 500);

    return () => clearInterval(interval);
  }, [form]);

  const {
    display_name = '',
    monthly_price = 0,
    yearly_price = 0,
    articles_limit = 0,
    social_posts_limit = 0,
    stories_limit = 0,
    features = { features: [] },
    is_active = true,
  } = previewData;

  // Convertir en nombres pour éviter les erreurs
  const monthlyPriceNum = typeof monthly_price === 'string' ? parseFloat(monthly_price) || 0 : monthly_price || 0;
  const yearlyPriceNum = typeof yearly_price === 'string' ? parseFloat(yearly_price) || 0 : yearly_price || 0;
  
  const monthlyTotal = monthlyPriceNum * 12;
  const savings = monthlyTotal - yearlyPriceNum;
  const actualDiscount = monthlyTotal > 0 ? (savings / monthlyTotal) * 100 : 0;

  const getFeaturesByCategory = (category: string): PlanFeature[] => {
    if (!features.features || !Array.isArray(features.features)) return [];
    return features.features.filter((feature: PlanFeature) => feature.category === category);
  };

  const categoryNames = {
    content: 'Contenu',
    distribution: 'Distribution',
    support: 'Support'
  };

  const languageOptions = [
    { key: 'fr', label: '🇫🇷 FR' },
    { key: 'en', label: '🇬🇧 EN' },
    { key: 'he', label: '🇮🇱 HE' }
  ];

  return (
    <div style={{ position: 'sticky', top: '24px' }}>
      <Card title="Prévisualisation" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Text strong>Langue :</Text>
            {languageOptions.map(lang => (
              <Button
                key={lang.key}
                size="small"
                type={previewLanguage === lang.key ? 'primary' : 'default'}
                onClick={() => setPreviewLanguage(lang.key)}
              >
                {lang.label}
              </Button>
            ))}
          </Space>
        </div>

        <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
          {/* En-tête du plan */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Title level={3} style={{ margin: 0 }}>
              {display_name || 'Nom du plan'}
            </Title>
            <div style={{ marginTop: '8px' }}>
              <Badge 
                status={is_active ? 'success' : 'error'} 
                text={is_active ? 'Actif' : 'Inactif'} 
              />
            </div>
          </div>

          {/* Prix */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {monthlyPriceNum.toFixed(2)} € <span style={{ fontSize: '14px', color: '#666' }}>/mois</span>
            </div>
            {yearlyPriceNum > 0 && (
              <div style={{ fontSize: '16px', color: '#52c41a', marginTop: '4px' }}>
                {yearlyPriceNum.toFixed(2)} € /an
                {actualDiscount > 0 && (
                  <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                    (-{actualDiscount.toFixed(0)}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Limites */}
          <div style={{ marginBottom: '16px' }}>
            <Text strong>Limites :</Text>
            <div style={{ marginTop: '8px' }}>
              <div>📝 {articles_limit} articles</div>
              <div>📱 {social_posts_limit} posts sociaux</div>
              <div>📖 {stories_limit} stories</div>
            </div>
          </div>

          <Divider />

          {/* Features par catégorie */}
          {Object.keys(categoryNames).map(category => {
            const categoryFeatures = getFeaturesByCategory(category);
            if (categoryFeatures.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: '16px' }}>
                <Text strong>{categoryNames[category as keyof typeof categoryNames]} :</Text>
                <div style={{ marginTop: '8px' }}>
                  {categoryFeatures.map((feature: PlanFeature) => (
                    <div key={feature.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      {feature.included ? (
                        <CheckOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      ) : (
                        <CloseOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                      )}
                      <Text style={{ textDecoration: feature.included ? 'none' : 'line-through' }}>
                        {feature.text[previewLanguage as keyof typeof feature.text] || 'Feature sans nom'}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Économies */}
          {savings > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                💰 Économisez {savings.toFixed(2)} € par an
              </Text>
            </div>
          )}
        </div>

        {/* Informations techniques */}
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          <Text>Aperçu mis à jour en temps réel</Text>
          <br />
          <Text>
            Features : {features.features ? features.features.length : 0} au total
          </Text>
        </div>
      </Card>
    </div>
  );
}; 