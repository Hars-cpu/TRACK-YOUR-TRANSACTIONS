const getDateRange = (range) => {
  const now = new Date();
  let start, end;

  // always keep end as current time
  end = new Date();

  switch (range) {
    case "daily":
      start = new Date();
      start.setHours(0, 0, 0, 0); // today start
      break;

    case "weekly": {
      const temp = new Date(); // ✅ do NOT mutate now
      const firstDay = temp.getDate() - temp.getDay();
      start = new Date(temp.setDate(firstDay));
      start.setHours(0, 0, 0, 0);
      const lastDay=start.getDate()+6; // 6 days later
      end.setDate(lastDay+1);
      
      end.setHours(0, 0, 0, 0);
      break;
    }

    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end=new Date(now.getFullYear(), now.getMonth()+1, 1);
      end.setHours(0, 0, 0, 0);
      break;

    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end=new Date(now.getFullYear()+1, 0, 1);
      end.setHours(0, 0, 0, 0);
      break;

    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end };
};
export default getDateRange;