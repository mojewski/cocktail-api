export async function paginate<T>(
  model: any,
  queryOptions: any = {},
  page: number = 1,
  limit: number = 10,
) {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const[data, total] = await Promise.all([
    model.findMany({
      ...queryOptions,
      skip,
      take: limitNum,
    }),
    model.count({ where: queryOptions.where }),
  ])

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}