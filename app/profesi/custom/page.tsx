import { ProfessionPage } from "../../components/ProfessionPage";
import { professions } from "../../data";

export default function CustomProfessionPage() {
  return <ProfessionPage profession={professions.custom} />;
}
