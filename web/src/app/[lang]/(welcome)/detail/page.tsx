"use client";

import { useState } from "react";
import Header from "@/app/[lang]/(welcome)/detail/components/Header";
import SpotDetails from "@/components/SpotDetails/SpotDetails";
import DetailSlider from "@/app/[lang]/(welcome)/detail/components/DetailSlider";
import TabNavigation from "@/app/[lang]/(welcome)/detail/components/TabNavigation";
import DetailModal from "@/app/[lang]/(welcome)/detail/components/DetailModal";

const DetailsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Header onShareClick={handleOpenModal} />
      <SpotDetails spot={undefined} />
      <DetailSlider />
      <TabNavigation />
      <DetailModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default DetailsPage;
