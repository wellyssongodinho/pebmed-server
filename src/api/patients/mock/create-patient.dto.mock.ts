import { CreatePatientDto } from '../dto/create-patient.dto';

export class CreatePatientDtoMock extends CreatePatientDto {
  name = 'Patient Mock 1';
  phone = '5531999999999';
  email = 'mock@mock.com';
  birthday = '1990-01-01';
  gender = 'masculino';
  height = '1.80m';
  weight = '80kg';
  constructor(name?, phone?, email?, birthday?, gender?, height?, weight?) {
    super();
    this.name = name ? name : this.name;
    this.phone = phone ? phone : this.phone;
    this.email = email ? email : this.email;
    this.birthday = birthday ? birthday : this.birthday;
    this.gender = gender ? gender : this.gender;
    this.height = height ? height : this.height;
    this.weight = weight ? weight : this.weight;
  }
}
