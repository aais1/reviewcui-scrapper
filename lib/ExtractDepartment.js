export const ExtractDepartment = (dep) => {
  const modifiedDep = dep.split("/")[3].replace("-", " ");

  const depart = modifiedDep.split(" ").map((word, index) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return depart.join(" ");
};
