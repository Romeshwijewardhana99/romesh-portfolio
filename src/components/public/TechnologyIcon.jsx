import { createElement } from "react";
import { Code2 } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiMysql,
  SiPrisma, SiGit, SiJavascript, SiTypescript, SiPython,
  SiDocker, SiPostgresql, SiMongodb, SiExpress, SiFigma,
} from "react-icons/si";

const technologyIcons = new Map([
  ["react", SiReact], ["reactjs", SiReact], ["reactnative", SiReact],
  ["next", SiNextdotjs], ["nextjs", SiNextdotjs],
  ["tailwind", SiTailwindcss], ["tailwindcss", SiTailwindcss],
  ["node", SiNodedotjs], ["nodejs", SiNodedotjs],
  ["mysql", SiMysql], ["prisma", SiPrisma], ["git", SiGit],
  ["javascript", SiJavascript], ["typescript", SiTypescript],
  ["python", SiPython], ["docker", SiDocker],
  ["postgresql", SiPostgresql], ["postgres", SiPostgresql],
  ["mongodb", SiMongodb], ["express", SiExpress], ["expressjs", SiExpress],
  ["figma", SiFigma],
]);


export default function TechnologyIcon({ name, size = 16 }) {
  const key = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const Icon = technologyIcons.get(key) || Code2;
  return createElement(Icon, { size, className: "shrink-0", "aria-hidden": true });
}
