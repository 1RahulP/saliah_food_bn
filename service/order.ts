import Order from "../model/order";

export const orderService = async (data: OrderRequest, userId: string) => {
  try {
    const response = await Order.create({
      ...data,
      createdId: userId as string,
    });
    //console.log({ response })
    return response;
  } catch (error: any) {
    throw error;
  }
};
