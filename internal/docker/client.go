package docker

import (
	"context"
	"fmt"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

type Client struct {
	cli *client.Client
}

type ContainerInfo struct {
	ID    string
	Name  string
	Image string
	State string
}

type ImageInfo struct {
	ID   string
	Name string
}

type ContainerType int

const (
	AllContainers ContainerType = iota
	RunningContainers
	StoppedContainers
)

func NewClient() (*Client, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}

	return &Client{cli: cli}, nil
}

func (c *Client) Close() error {
	return c.cli.Close()
}

func (c *Client) ListContainers(ctx context.Context, containerType ContainerType) ([]ContainerInfo, error) {
	options := container.ListOptions{}

	switch containerType {
	case AllContainers:
		options.All = true
	case RunningContainers:
		// Default: only running containers
	case StoppedContainers:
		options.All = true
		filterArgs := filters.NewArgs()
		filterArgs.Add("status", "exited")
		options.Filters = filterArgs
	}

	containers, err := c.cli.ContainerList(ctx, options)
	if err != nil {
		return nil, fmt.Errorf("failed to list containers: %w", err)
	}

	var result []ContainerInfo
	for _, container := range containers {
		if len(container.Names) == 0 {
			continue
		}

		name := strings.TrimPrefix(container.Names[0], "/")
		result = append(result, ContainerInfo{
			ID:    container.ID[:12], // Short ID like in Rust version
			Name:  name,
			Image: container.Image,
			State: container.State,
		})
	}

	return result, nil
}

func (c *Client) ListImages(ctx context.Context) ([]ImageInfo, error) {
	images, err := c.cli.ImageList(ctx, image.ListOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to list images: %w", err)
	}

	var result []ImageInfo
	for _, img := range images {
		if len(img.RepoTags) == 0 {
			continue
		}

		// Extract short ID without sha256: prefix
		id := img.ID
		if len(id) > 19 && id[:7] == "sha256:" {
			id = id[7:19] // Take 12 characters like the Rust version
		}

		result = append(result, ImageInfo{
			ID:   id,
			Name: img.RepoTags[0],
		})
	}

	return result, nil
}
