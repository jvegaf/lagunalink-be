
import { CreateJobOpeningRequestMother } from '../application/CreateJobOpeningRequestMother';
import { JobOpeningMother } from './JobOpeningMother';

describe('JobOpening', () => {

  it('should return a new jobOpening instance', () => {
    const request = CreateJobOpeningRequestMother.random();

    const jobOpening = JobOpeningMother.fromRequest(request);

    expect(jobOpening.company.value).toBe(request.company);
    expect(jobOpening.title.value).toBe(request.title);
    expect(jobOpening.position.value).toBe(request.position);
  });
});