export const ExtractDepartment = () => {
  const dep =
    "https://www.cuiatd.edu.pk/computer-engineering/faculty-profiles-ce/";

  const modifiedDep = dep.split("/")[3].replace("-", " ");

  const depart = modifiedDep.split(" ").map((word, index) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return depart.join(" ");
};
