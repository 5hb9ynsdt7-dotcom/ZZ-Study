import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/壮壮的学习乐园/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders home page by default', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/欢迎来到学习乐园/i);
  expect(welcomeElement).toBeInTheDocument();
});
