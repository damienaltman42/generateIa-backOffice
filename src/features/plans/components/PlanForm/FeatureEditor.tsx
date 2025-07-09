import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Tabs, Typography, Divider, Row, Col, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

const { Text } = Typography;
const { Option } = Select;

interface FeatureEditorProps {
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

interface PlanFeatures {
  features: PlanFeature[];
}

export const FeatureEditor: React.FC<FeatureEditorProps> = ({ form }) => {
  const [activeLanguage, setActiveLanguage] = useState('fr');
  const [features, setFeatures] = useState<PlanFeature[]>([]);

  // Synchroniser les features avec le formulaire
  useEffect(() => {
    const formFeatures = form.getFieldValue('features') || { features: [] };
    setFeatures(formFeatures.features || []);
  }, [form]);

  const updateFeatures = (newFeatures: PlanFeature[]) => {
    setFeatures(newFeatures);
    form.setFieldsValue({ features: { features: newFeatures } });
  };

  const addFeature = () => {
    const newFeature: PlanFeature = {
      key: `feature_${Date.now()}`,
      text: {
        fr: '',
        en: '',
        he: ''
      },
      category: 'content',
      included: true,
    };
    updateFeatures([...features, newFeature]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    updateFeatures(newFeatures);
  };

  const updateFeature = (index: number, field: keyof PlanFeature, value: any) => {
    const newFeatures = [...features];
    if (field === 'text') {
      newFeatures[index] = {
        ...newFeatures[index],
        text: {
          ...newFeatures[index].text,
          [activeLanguage]: value
        }
      };
    } else {
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: value
      };
    }
    updateFeatures(newFeatures);
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(feature => feature.category === category);
  };

  const categoryNames = {
    content: 'Contenu',
    distribution: 'Distribution',
    support: 'Support'
  };

  const languageNames = {
    fr: 'Français',
    en: 'English',
    he: 'עברית'
  };

  const tabItems = [
    {
      key: 'fr',
      label: '🇫🇷 Français',
    },
    {
      key: 'en',
      label: '🇬🇧 English',
    },
    {
      key: 'he',
      label: '🇮🇱 עברית',
    }
  ];

  return (
    <Card title="Features" style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="dashed"
          onClick={addFeature}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
        >
          Ajouter une feature
        </Button>
      </div>

      <Tabs
        activeKey={activeLanguage}
        onChange={setActiveLanguage}
        items={tabItems}
      />

      <div style={{ marginTop: '16px' }}>
        {Object.keys(categoryNames).map(category => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <Divider orientation="left">
              <Text strong>{categoryNames[category as keyof typeof categoryNames]}</Text>
            </Divider>
            
            {getFeaturesByCategory(category).length === 0 ? (
              <Text type="secondary" style={{ fontStyle: 'italic' }}>
                Aucune feature dans cette catégorie
              </Text>
            ) : (
              getFeaturesByCategory(category).map((feature, categoryIndex) => {
                const globalIndex = features.findIndex(f => f.key === feature.key);
                return (
                  <Card
                    key={feature.key}
                    size="small"
                    style={{ marginBottom: '12px' }}
                    title={
                      <Space>
                        <Text>{feature.text[activeLanguage as keyof typeof feature.text] || 'Feature sans nom'}</Text>
                        <Switch
                          checked={feature.included}
                          onChange={(checked) => updateFeature(globalIndex, 'included', checked)}
                          checkedChildren="Inclus"
                          unCheckedChildren="Non inclus"
                          size="small"
                        />
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFeature(globalIndex)}
                        size="small"
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item label={`Nom (${languageNames[activeLanguage as keyof typeof languageNames]})`}>
                          <Input
                            value={feature.text[activeLanguage as keyof typeof feature.text]}
                            onChange={(e) => updateFeature(globalIndex, 'text', e.target.value)}
                            placeholder={`Nom de la feature en ${languageNames[activeLanguage as keyof typeof languageNames]}`}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Catégorie">
                          <Select
                            value={feature.category}
                            onChange={(value) => updateFeature(globalIndex, 'category', value)}
                          >
                            <Option value="content">Contenu</Option>
                            <Option value="distribution">Distribution</Option>
                            <Option value="support">Support</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}
          </div>
        ))}
      </div>

      {/* Validation des features */}
      <Form.Item
        name="features"
        rules={[
          {
            validator: (_, value) => {
              if (!value || !value.features || value.features.length === 0) {
                return Promise.reject(new Error('Au moins une feature est requise'));
              }

              // Vérifier que toutes les langues sont remplies
              for (const feature of value.features) {
                if (!feature.text.fr || !feature.text.en || !feature.text.he) {
                  return Promise.reject(new Error('Toutes les langues doivent être remplies pour chaque feature'));
                }
              }

              return Promise.resolve();
            }
          }
        ]}
      >
        <div style={{ display: 'none' }} />
      </Form.Item>

      {/* Résumé des features */}
      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
        <Text strong>Résumé : </Text>
        <Text>{features.length} feature(s) - </Text>
        <Text>Contenu: {getFeaturesByCategory('content').length}, </Text>
        <Text>Distribution: {getFeaturesByCategory('distribution').length}, </Text>
        <Text>Support: {getFeaturesByCategory('support').length}</Text>
      </div>
    </Card>
  );
}; 