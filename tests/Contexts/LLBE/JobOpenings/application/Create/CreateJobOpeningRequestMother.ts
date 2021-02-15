import { CreateJobOpeningRequest } from '../../../../../../src/Contexts/LLBE/JobOpenings/application/Create/CreateJobOpeningRequest';
import { CompanyId } from '../../../../../../src/Contexts/LLBE/Shared/domain/Companies/CompanyId';
import { JobOpenTitle } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenTitle';
import { JobOpenPosition } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenPosition';
import { JobOpenConditions } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenConditions';
import { JobOpenResponsibilities } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenResponsibilities';
import { JobOpenQualification } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenQualification';
import { JobOpenPrevExperience } from '../../../../../../src/Contexts/LLBE/JobOpenings/domain/JobOpenPrevExperience';
import { CompanyIdMother } from '../../../Shared/domain/Companies/CompanyIdMother';
import { JobOpenTitleMother } from '../../domain/JobOpenTitleMother';
import { JobOpenPositionMother } from '../../domain/JobOpenPositionMother';
import { JobOpenConditionsMother } from '../../domain/JobOpenConditionsMother';
import { JobOpenResponsibilitiesMother } from '../../domain/JobOpenResponsibilitiesMother';
import { JobOpenQualificationMother } from '../../domain/JobOpenQualificationMother';
import { JobOpenPrevExperienceMother } from '../../domain/JobOpenPrevExperienceMother';

export class CreateJobOpeningRequestMother {
  static create(
    company: CompanyId,
    title: JobOpenTitle,
    position: JobOpenPosition,
    conditions: JobOpenConditions,
    responsibilities: JobOpenResponsibilities,
    qualification: JobOpenQualification,
    prevExperience: JobOpenPrevExperience
  ): CreateJobOpeningRequest {
    return {
      company: company.value,
      title: title.value,
      position: position.value,
      conditions: conditions.value,
      responsibilities: responsibilities.value,
      qualification: qualification.value,
      prevExperience: prevExperience.value,
    };
  }

  static random(): CreateJobOpeningRequest {
    return this.create(
      CompanyIdMother.random(),
      JobOpenTitleMother.random(),
      JobOpenPositionMother.random(),
      JobOpenConditionsMother.random(),
      JobOpenResponsibilitiesMother.random(),
      JobOpenQualificationMother.random(),
      JobOpenPrevExperienceMother.random()
    );
  }
}