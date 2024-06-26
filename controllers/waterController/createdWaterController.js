import WaterTracking from "../../models/waterModel.js";
import User from "../../models/userModel.js";

const getWaterController = async (req, res) => {
  const { id } = res.user;

  const { date } = req.body;

  if (!date) {
    return res.status(409).send("BAD REQ");
  }

  const { daily_limit } = await User.findById(id);
  const water = await WaterTracking.findOne({ date: date, owner: id });

  if (water !== null) {
    const count = water.water_entries.length;
    const totalAmount = water.water_entries.reduce(
      (acc, entry) => acc + entry.amount,
      0
    );
    const percentage = (totalAmount / water.daily_limit) * 100;
    const updatedWater = await WaterTracking.findByIdAndUpdate(
      water.id,
      {
        count,
        percent: Math.round(percentage),
        daily_limit,
      },
      { new: true }
    );

    return res.status(200).send(updatedWater);
  }

  const newWater = await WaterTracking.create({
    date: date,
    owner: id,
    daily_limit: 2000,
  });
  res.status(201).send(newWater);
};
export default getWaterController;
