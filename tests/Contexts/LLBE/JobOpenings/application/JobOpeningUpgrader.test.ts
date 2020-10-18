import { JobOpeningMother } from '../domain/JobOpeningMother';
import { JobOpeningRepositoryMock } from '../__mocks__/JobOpeningRepositoryMock';
import { CreateJobOpeningRequestMother } from './CreateJobOpeningRequestMother';
import { JobOpeningCreator } from '../../../../../src/Contexts/LLBE/JobOpenings/application/JobOpeningCreator';
import { JobOpeningIdMother } from '../../Shared/domain/JobOpenings/JobOpeningIdMother';
import { UpgradeJobOpeningRequestMother } from './UpgradeJobOpeningRequestMother';
import { JobOpeningUpgrader } from '../../../../../src/Contexts/LLBE/JobOpenings/application/JobOpeningUpgrader';
import { JobOpeningNotFound } from '../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpeningNotFound';

let repository: JobOpeningRepositoryMock;
let upgrader: JobOpeningUpgrader;

beforeEach(() => {
  repository = new JobOpeningRepositoryMock();
  upgrader = new JobOpeningUpgrader(repository);
});

it('should upgrade a valid jobOpening', async () => {
  const jobOpenId = JobOpeningIdMother.random();
  const request = UpgradeJobOpeningRequestMother.random(jobOpenId.value);
  const jobOpening = JobOpeningMother.fromCreateRequest(request);

  repository.whenSearchThenReturn(jobOpening);
  await upgrader.run(request);

  repository.assertLastSavedJobOpeningIs(jobOpening);
});

it('should throw a JobOpeningNotFound when try update a non exist Job Opening', async () => {
  const jobOpenId = JobOpeningIdMother.random();
  const request = UpgradeJobOpeningRequestMother.random(jobOpenId.value);
  repository.whenSearchThenReturn(null);

  await expect(upgrader.run(request)).rejects.toThrow(JobOpeningNotFound);
});
