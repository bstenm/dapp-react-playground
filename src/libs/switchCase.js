export const switchCase = (cases) => {
      let res;
      for (const e of cases) {
            if (e.case) return (res = e.then());
      }
      return res;
};
