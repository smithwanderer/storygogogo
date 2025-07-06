import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const SubscriptionContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const SubscriptionModal = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.5;
`;

const PlanTabs = styled.div`
  display: flex;
  background: #f5f5f5;
  border-radius: 25px;
  padding: 4px;
  margin-bottom: 30px;
`;

const PlanTab = styled.button`
  flex: 1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#666'};
  border: none;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PricingCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #28a745;
  border-radius: 16px;
  padding: 25px 20px;
  margin-bottom: 30px;
  position: relative;
`;

const BestValueTag = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: #fff;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
`;

const PlanName = styled.h3`
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 10px 0;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const MainPrice = styled.span`
  color: #333;
  font-size: 18px;
  text-decoration: line-through;
`;

const DiscountPrice = styled.span`
  color: #28a745;
  font-size: 32px;
  font-weight: bold;
`;

const PriceUnit = styled.span`
  color: #666;
  font-size: 14px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  color: #333;
  font-size: 14px;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  
  &:before {
    content: '•';
    color: #28a745;
    font-weight: bold;
    position: absolute;
    left: 0;
  }
`;

const SubscribeButton = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5856eb;
    transform: translateY(-2px);
  }
`;

const DisclaimerText = styled.p`
  color: #888;
  font-size: 12px;
  line-height: 1.4;
  margin: 20px 0 0 0;
  text-align: left;
`;

const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = {
    weekly: { name: 'Weekly', price: '$3.99', unit: 'per week' },
    monthly: { name: 'Monthly', price: '$14.99', unit: 'per month', dailyPrice: '$0.50' },
    quarterly: { name: 'Quarterly', price: '$39.99', unit: 'per quarter' }
  };

  const handleSubscribe = () => {
    // Handle subscription logic here
    alert('Subscription feature under development...');
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <SubscriptionContainer>
      <SubscriptionModal>
        <CloseButton onClick={handleClose}>
          <FiX />
        </CloseButton>
        
        <Title>My Drama</Title>
        <Subtitle>Enjoy unlimited access to our unique romantic series</Subtitle>
        
        <PlanTabs>
          <PlanTab 
            active={selectedPlan === 'weekly'}
            onClick={() => setSelectedPlan('weekly')}
          >
            Weekly
          </PlanTab>
          <PlanTab 
            active={selectedPlan === 'monthly'}
            onClick={() => setSelectedPlan('monthly')}
          >
            Monthly
          </PlanTab>
          <PlanTab 
            active={selectedPlan === 'quarterly'}
            onClick={() => setSelectedPlan('quarterly')}
          >
            Quarterly
          </PlanTab>
        </PlanTabs>
        
        <PricingCard>
          {selectedPlan === 'monthly' && <BestValueTag>Best Value</BestValueTag>}
          <PlanName>Monthly</PlanName>
          <PriceContainer>
            <MainPrice>$14.99</MainPrice>
            <DiscountPrice>$0.50</DiscountPrice>
            <PriceUnit>per day</PriceUnit>
          </PriceContainer>
          
          <FeaturesList>
            <FeatureItem>Best Value</FeatureItem>
            <FeatureItem>Early access to new series</FeatureItem>
            <FeatureItem>Access to 30+ premium series</FeatureItem>
          </FeaturesList>
        </PricingCard>
        
        <SubscribeButton onClick={handleSubscribe}>
          Get Full Access
        </SubscribeButton>
        
        <DisclaimerText>
          By continuing, you agree that if you don't cancel at least 24 hours before your introductory offer ends, you will automatically be charged the full amount of $14.99 per month until you cancel in Settings. Learn more about cancellation and refund policies. Subscription terms.
        </DisclaimerText>
      </SubscriptionModal>
    </SubscriptionContainer>
  );
};

export default Subscription;