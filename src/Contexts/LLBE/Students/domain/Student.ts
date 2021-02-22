import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { StudentId } from '../../Shared/domain/Students/StudentId';
import { StudentName } from './StudentName';
import { StudentSurname } from './StudentSurname';
import { StudentLastname } from './StudentLastname';
import { Qualification } from './Qualification';
import { Language } from './Language';
import { JobExperience } from './JobExperience';

export class Student extends AggregateRoot {
  readonly id: StudentId;
  readonly name: StudentName;
  readonly surname: StudentSurname;
  readonly lastname: StudentLastname;
  private qualification: Qualification | undefined;
  private languages: Language[] | undefined;
  private jobexperiences: JobExperience[] | undefined;

  constructor(
    id: StudentId,
    name: StudentName,
    surname: StudentSurname,
    lastname: StudentLastname,
    qualification ?: Qualification,
    languages ?: Language[],
    jobexperiences ?: JobExperience[]) {
    super();
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.lastname = lastname;
    this.qualification = qualification;
    this.languages = languages;
    this.jobexperiences = jobexperiences;
  }

  static create(
    id: StudentId,
    name: StudentName,
    surname: StudentSurname,
    lastname: StudentLastname,
    qualification ?: Qualification,
    languages ?: Language[],
    jobexperiences ?: JobExperience[]): Student {
    return new Student(id, name, surname, lastname, qualification, languages, jobexperiences);
  }

  static fromPrimitives(
    plainData: {
      id: string;
      name: string;
      surname: string;
      lastname: string;
      qualification: { title: string; start_date: string; end_date: string };
      languages: { name: string; speak: number; write: number }[];
      job_experiences: {
        company: string;
        position: string;
        responsibilities: string;
        start_date: string;
        end_date: string
      }[];
    }): Student {
    return new Student(
      new StudentId(plainData.id),
      new StudentName(plainData.name),
      new StudentSurname(plainData.surname),
      new StudentLastname(plainData.lastname),
      Qualification.fromPrimitives(plainData.qualification),
      this.languagesFromPrimitives(plainData.languages),
      this.jobexperiencesFromPrimitives(plainData.job_experiences)
  );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      surname: this.surname.value,
      lastname: this.lastname.value,
      qualification: this.qualification?.toPrimitives(),
      languages: this.languagesToPrimitives(),
      job_experiences: this.jobexperiencesToPrimitives()
    };
  }

  private languagesToPrimitives() {
    return this.languages?.map(language => language.toPrimitives());
  }

  private static languagesFromPrimitives(languages: { name: string; speak: number; write: number }[]) {
    if (languages === undefined) {
      return;
    }
    return languages.map(language => Language.fromPrimitives(language));
  }

  private jobexperiencesToPrimitives() {
    return this.jobexperiences?.map(job => job.toPrimitives());
  }

  private static jobexperiencesFromPrimitives(jobexperiences: {
    company: string;
    position: string;
    responsibilities: string;
    start_date: string;
    end_date: string
  }[]) {
    if (jobexperiences === undefined) {
      return;
    }
    return jobexperiences.map(job => JobExperience.fromPrimitives(job));
  }
}
