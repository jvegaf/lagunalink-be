import { Nullable } from '../../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { Enrollment } from '../../domain/Enrollment';
import { EnrollmentRepository } from '../../domain/EnrollmentRepository';
import { EnrollmentId } from '../../../Shared/domain/Enrollments/EnrollmentId';
import { JobOpeningId } from '../../../Shared/domain/JobOpenings/JobOpeningId';
import { StudentId } from '../../../Shared/domain/Students/StudentId';

export class MongoEnrollmentRepository extends MongoRepository<Enrollment> implements EnrollmentRepository {
  public save(enrollment: Enrollment): Promise<void> {
    return this.persist(enrollment.id.value, enrollment);
  }

  public async search(id: EnrollmentId): Promise<Nullable<Enrollment>> {
    const collection = await this.collection();

    const document = await collection.findOne({ _id: id.value });

    return document ? Enrollment.fromPrimitives({ ...document, id: id.value }) : null;
  }

  public async searchByStudent(studentId: StudentId): Promise<Enrollment[]> {
    const collection = await this.collection();

    const resultDocs = await collection.find({ student: studentId.value }).toArray();

    return resultDocs.map(document => Enrollment.fromPrimitives({ ...document, id: document._id }));
  }

  public async quantityOfJobOpening(id: JobOpeningId): Promise<Number> {
    const collection = await this.collection();

    return await collection.countDocuments({ job_opening: id.value });
  }

  public remove(id: EnrollmentId): Promise<void> {
    return this.delete(id.value);
  }

  protected moduleName(): string {
    return 'enrollments';
  }

  public async searchByJobOpening(openingId: JobOpeningId): Promise<Array<Enrollment>> {
    const collection = await this.collection();

    const resultDocs = await collection.find({ job_opening: openingId.value }).toArray();

    return resultDocs.map(document => Enrollment.fromPrimitives({ ...document, id: document._id }));
  }
}
