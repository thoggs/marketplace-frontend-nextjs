import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "@/store/reducers/rootReducer";
import { ZhUserCardProps } from "@/shared/components/ZhUserCard/types";

export default function ZhUserCard({ className }: ZhUserCardProps) {
  const userProfile = useSelector((state: AppState) => state.userProfile);

  return (
    <UnstyledButton className={className}>
      <Group>
        <Avatar src={userProfile.profileImage} radius="xl"/>
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {userProfile.name}
          </Text>
          <Text c="dimmed" size="xs">
            {userProfile.email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
