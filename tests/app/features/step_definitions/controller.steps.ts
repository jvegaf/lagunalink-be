import assert from 'assert';
import { AfterAll, Before, Given, Then, When } from 'cucumber';
import request from 'supertest';
import app from '../../../../src/app/lagunalink_be/app';
import container from '../../../../src/app/lagunalink_be/config/dependency-injection';
import { EnvironmentArranger } from '../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger';
import { UserRepository } from '../../../../src/Contexts/LLBE/Users/domain/UserRepository';
import { StudentRepository } from '../../../../src/Contexts/LLBE/Students/domain/StudentRepository';
import { CreateUserRequestMother } from '../../../Contexts/LLBE/Users/application/CreateUserRequestMother';
import { UserMother } from '../../../Contexts/LLBE/Users/domain/UserMother';
import { hashSync } from 'bcryptjs';
import { CompanyRepository } from '../../../../src/Contexts/LLBE/Companies/domain/CompanyRepository';
import { JobOpeningRepository } from '../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpeningRepository';
import { UpgradeJobOpeningRequestMother } from '../../../Contexts/LLBE/JobOpenings/application/Update/UpgradeJobOpeningRequestMother';
import { JobOpeningMother } from '../../../Contexts/LLBE/JobOpenings/domain/JobOpeningMother';
import { CreateJobOpeningRequestMother } from '../../../Contexts/LLBE/JobOpenings/application/Create/CreateJobOpeningRequestMother';
import path from 'path';
import { StudentCreator } from '../../../../src/Contexts/LLBE/Students/application/Create/StudentCreator';
import { CompanyCreator } from '../../../../src/Contexts/LLBE/Companies/application/Create/CompanyCreator';

let _request: request.Test;
let _response: request.Response;
let accessToken: string;
let authRequest: { id: string; email: string; password: string };

const ROLE_COMPANY = 'ROLE_COMPANY';
const ROLE_STUDENT = 'ROLE_STUDENT';

const userRepository: UserRepository = container.get('App.users.UserRepository');

const studentRepository: StudentRepository = container.get('App.students.StudentRepository');
const studentCreator: StudentCreator = container.get('App.students.StudentCreator');
const companyRepository: CompanyRepository = container.get('App.companies.CompanyRepository');
const companyCreator: CompanyCreator = container.get('App.companies.CompanyCreator');
const jobOpenRepository: JobOpeningRepository = container.get('App.jobOpenings.JobOpeningRepository');

async function createAccountNotVerified() {
  const userRequest = CreateUserRequestMother.random();
  userRequest.email = 'ramoncin@gmail.com';
  userRequest.password = hashSync('123123', 10);
  userRequest.isActive = false;
  const user = UserMother.fromRequest(userRequest);

  await userRepository.save(user);
}
async function createUser(role: string, id = '') {
  const userRequest = CreateUserRequestMother.random();
  const passwordPlane = userRequest.password;
  if (id !== '') {
    userRequest.id = id;
  }
  userRequest.password = hashSync(userRequest.password, 10);
  userRequest.isActive = true;
  userRequest.role = role;
  if (role === ROLE_STUDENT){ await studentCreator.run(userRequest.id);}
  if (role === ROLE_COMPANY){ await companyCreator.run(userRequest.id);}
  const user = UserMother.fromRequest(userRequest);
  await userRepository.save(user);

  return {
    id: userRequest.id,
    email: userRequest.email,
    password: passwordPlane,
  };
}

async function loginUserAccount(authReq: object) {
  const response = await request(app).post('/auth/signin').send(authReq);
  return response.body.accessToken;
}

async function registerRandomJobOpening() {
  const jobOpening = JobOpeningMother.random();
  await jobOpenRepository.save(jobOpening);
}

async function registerRandomJobOpeningWithId(id: string, companyId = '') {
  const jobOpeningRequest = UpgradeJobOpeningRequestMother.random(id);
  if (companyId !== '') {
    jobOpeningRequest.company = companyId;
  }
  await jobOpenRepository.save(JobOpeningMother.fromUpgradeRequest(jobOpeningRequest));
}

async function registerSeveralJobOpenings() {
  for (let i = 0; i < 10; i++) {
    await registerRandomJobOpening();
  }
}

async function registerSeveralCompanies() {
  for (let i = 0; i < 10; i++) {
    const user = await createUser(ROLE_COMPANY);
  }
}

async function registerSeveralJobOpeningsOfCompany(companyId: string, quantity?: number) {
  const amount = quantity !== undefined ? quantity : 10;
  for (let i = 0; i < amount; i++) {
    const comReq = CreateJobOpeningRequestMother.randomOfCompany(companyId);
    const job = JobOpeningMother.fromCreateRequest(comReq);
    await jobOpenRepository.save(job);
  }
}

Given('I have a Student Role Account', async () => {
  authRequest = await createUser(ROLE_STUDENT);
});

Given('I have a Company Role Account', async () => {
  authRequest = await createUser(ROLE_COMPANY);
});

Given('Previously was registered a company with id {string}', async (id: string) => {
  authRequest = await createUser(ROLE_COMPANY, id);
});

Given('I have a Student Role Account with id {string}', async (id: string) => {
  authRequest = await createUser(ROLE_STUDENT, id);
});

Given('I have a Company Role Account with id {string}', async (id: string) => {
  authRequest = await createUser(ROLE_COMPANY, id);
});

Given('I am logged in the application', async () => {
  accessToken = await loginUserAccount(authRequest);
});

Given('I published a Job Opening with id {string}', async (id: string) => {
  await registerRandomJobOpeningWithId(id, authRequest.id);
});

Given('exists a Job Opening with id {string}', async (id: string) => {
  const jobOpeningRequest = UpgradeJobOpeningRequestMother.random(id);
  const jobOpening = JobOpeningMother.fromUpgradeRequest(jobOpeningRequest);
  await jobOpenRepository.save(jobOpening);
});

Given('I am a user with account not yet verified', async () => {
  await createAccountNotVerified();
});
Given('Previously was created a Job Opening with id {string}', async (id: string) => {
  await registerRandomJobOpeningWithId(id);
});

Given('Several Job Openings were previously created', async () => {
  await registerSeveralJobOpenings();
});

Given('Several Companies were previously created', async () => {
  await registerSeveralCompanies();
});

Given('This Company published several Job Openings', async () => {
  await registerSeveralJobOpeningsOfCompany(authRequest.id);
});

When('I send a GET request to {string}', (route: string) => {
  if (accessToken === '') {
    _request = request(app).get(route).send();
  }
  _request = request(app).get(route).auth(accessToken, { type: 'bearer' }).send();
});

When('I send a POST request to {string}', (route: string) => {
  if (accessToken === '') {
    _request = request(app).post(route).send();
  }
  _request = request(app).post(route).auth(accessToken, { type: 'bearer' }).send();
});

When('I send a POST request to {string} with body:', (route: string, body: string) => {
  if (accessToken === '') {
    _request = request(app).post(route).send(JSON.parse(body));
  }
  _request = request(app).post(route).auth(accessToken, { type: 'bearer' }).send(JSON.parse(body));
});

When('I send a PUT request to {string} with body:', (route: string, body: string) => {
  _request = request(app).put(route).auth(accessToken, { type: 'bearer' }).send(JSON.parse(body));
});

When('I send a DELETE request to {string}', (route: string) => {
  _request = request(app).delete(route).auth(accessToken, { type: 'bearer' }).send();
});

When('Upload a image in a PUT request to {string}', (route: string) => {
  _request = request(app)
    .put(route)
    .auth(accessToken, { type: 'bearer' })
    .attach('image', path.join(__dirname, 'fakelogo.jpg'));
});

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response should be empty', () => {
  assert.deepStrictEqual(_response.body, {});
});

Then('the response content should be:', response => {
  assert.strictEqual(_response.body, JSON.parse(response));
});

Then('print the response', () => {
  console.log(_response.body);
});

Before(async () => {
  accessToken = '';
  authRequest = { id: '', email: '', password: '' };
  const environmentArranger: Promise<EnvironmentArranger> = container.get('App.EnvironmentArranger');
  await (await environmentArranger).arrange();
});

AfterAll(async () => {
  const environmentArranger: Promise<EnvironmentArranger> = container.get('App.EnvironmentArranger');
  await (await environmentArranger).close();
});
