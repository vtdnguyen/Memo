import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('@/assets/onboarding/cam.json'),
    text: 'Chia Sẻ Khoảng Khắc Tuyệt Vời Của Bạn',
    textColor: '#3f301d',
    backgroundColor: '#f2f7f4',
  },
  {
    id: 2,
    animation: require('@/assets/onboarding/phone.json'),
    text: 'Tạo Ra Kết Nối Với Mọi Người',
    textColor: '#13143e',
    backgroundColor: '#dcf2ff',
  },
  {
    id: 3,
    animation: require('@/assets/onboarding/run.json'),
    text: 'Cùng MEMO Bắt Đầu Hành Trình Đầy Thú Vị!',
    textColor: '#163414',
    backgroundColor: '#f0f7da',
  },
];

export default data;