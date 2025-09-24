
export enum MeetingType {
  MDP = 'MDP',
  Mela = 'Mela'
}

export enum Location {
  Salem = 'Salem',
  Coimbatore = 'Coimbatore',
  Madurai = 'Madurai',
  Trichy = 'Trichy'
}

export enum Supervisor {
  SivaMahesh = 'Siva Mahesh',
  Vinoth = 'Vinoth',
  IbunuKatheer = 'Ibunu Katheer',
  UmarRifas = 'Umar Rifas'
}

export enum GiftType {
  BoosterBottle = 'Booster bottle',
  H2OBottle = 'H2O bottle'
}

export interface FormData {
  date: string;
  venueName: string;
  meetingType: MeetingType | '';
  location: Location | '';
  supervisor: Supervisor | '';
  tollFreeNumber: string;
  pidiliteTeamMembers: string;
  totalAttendees: string;
  registeredInPortal: string;
  giftsProvided: string;
  giftsByCMDI: string;
  remainingGiftType: GiftType | '';
  remainingGifts: string;
  remainingBags: string;
  remainingMaterials: string;
  comments: string;
}

export type FormErrors = {
  [K in keyof FormData]?: string;
};