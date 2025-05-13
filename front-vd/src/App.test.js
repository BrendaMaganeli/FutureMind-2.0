import { render, screen } from '@testing-library/react';
import VideoConference from './App';

test('renders learn react link', () => {
  render(<VideoConference />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
